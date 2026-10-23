"""Validate audit coverage and flag comparable consumption growth. Reads JSON only."""
import argparse
from collections import Counter
from decimal import Decimal, ROUND_HALF_UP
from datetime import date
import json
from pathlib import Path


def money(value):
    return Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def check(dataset, inventory, observations):
    errors = []
    actual = {}
    for scope, rows in [('main', dataset['rows']), ('kaadr', dataset['kaadr'])]:
        counts = Counter(row['id'] for row in rows)
        errors.extend(f'Duplicate {scope} row: {key}' for key, count in counts.items() if count != 1)
        for row in rows:
            actual[(scope, row['id'])] = row
            if row['lo'] < 0 or row['hi'] < row['lo']:
                errors.append(f'Invalid cost range: {row["id"]}')
    expected = {(item['scope'], item['id']): item for item in inventory['priced']}
    if len(expected) != len(inventory['priced']):
        errors.append('Duplicate inventory identity')
    for key in expected.keys() - actual.keys():
        errors.append(f'Known cost omitted: {key}')
    for key in actual.keys() - expected.keys():
        errors.append(f'Cost missing from inventory: {key}')
    for key in actual.keys() & expected.keys():
        row, item = actual[key], expected[key]
        if row.get('venture', 'kaadr' if key[0] == 'kaadr' else None) != item['venture']:
            errors.append(f'Owner differs from inventory: {key}')
        if 'monthly_usd' in item:
            if any(money(row[bound]) != money(item['monthly_usd']) for bound in ['lo', 'hi']):
                errors.append(f'Confirmed recurring amount differs: {key}')
        if item.get('account') and row.get('account') != item['account']:
            errors.append(f'Account differs from inventory: {key}')
    unknown = [item[0] for item in dataset['unknown']]
    if Counter(unknown) != Counter(inventory['unpriced']):
        errors.append('Unpriced coverage differs from inventory')
    for bound in ['lo', 'hi']:
        total = sum(Decimal(str(row[bound])) for row in dataset['rows'])
        if money(total) != money(dataset['totals'][bound]):
            errors.append(f'Headline {bound} does not reconcile')

    flags, gaps = [], []
    required = set(inventory.get('growth_required', []))
    observed = Counter(item['id'] for item in observations)
    if not required:
        gaps.append({'id': 'growth-inventory', 'reason': 'Resource growth coverage has not been defined'})
    for key in sorted(required - observed.keys()):
        gaps.append({'id': key, 'reason': 'Required resource consumption comparison is missing'})
    errors.extend(f'Duplicate growth observation: {key}' for key, count in observed.items() if count > 1)
    for item in observations:
        if item.get('comparison') != 'comparable':
            gaps.append({'id': item['id'], 'reason': item.get('reason', 'Comparable consumption windows unavailable')})
            continue
        if item.get('kind') != 'consumption' or item.get('unit') != 'USD/day':
            errors.append(f'Growth requires consumption in USD/day: {item["id"]}')
            continue
        if not all(item.get(key) for key in ['source', 'asof', 'previous_window', 'current_window']):
            errors.append(f'Growth evidence/window missing: {item["id"]}')
            continue
        try:
            previous_start, previous_end = map(date.fromisoformat, item['previous_window'].split('/'))
            current_start, current_end = map(date.fromisoformat, item['current_window'].split('/'))
            asof = date.fromisoformat(item['asof'][:10])
            if not (previous_start < previous_end <= current_start < current_end <= asof
                    and previous_end - previous_start == current_end - current_start):
                raise ValueError('Windows must be complete, non-overlapping and equal in duration')
        except (ValueError, TypeError):
            errors.append(f'Invalid growth comparison windows: {item["id"]}')
            continue
        previous, current = Decimal(str(item['previous'])), Decimal(str(item['current']))
        if min(previous, current) < 0:
            errors.append(f'Negative consumption rate: {item["id"]}')
            continue
        delta = current - previous
        fraction = delta / previous if previous else None
        if (previous == 0 and current > 0) or delta >= 5 or (delta >= 1 and fraction >= Decimal('0.25')):
            flags.append({'id': item['id'], 'daily_increase_usd': float(delta),
                          'increase_percent': float(fraction * 100) if fraction is not None else None,
                          'asof': item['asof'], 'source': item['source'],
                          'previous_window': item['previous_window'], 'current_window': item['current_window'],
                          'owner': item.get('owner', 'Unidentified'), 'environment': item.get('environment', 'Unidentified')})
    return {'valid': not errors, 'errors': errors, 'growth_flags': flags, 'growth_coverage_gaps': gaps}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('dataset', type=Path)
    parser.add_argument('inventory', type=Path)
    parser.add_argument('--growth', type=Path)
    args = parser.parse_args()
    result = check(json.loads(args.dataset.read_text()), json.loads(args.inventory.read_text()),
                   json.loads(args.growth.read_text()) if args.growth else [])
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if result['valid'] else 1)
