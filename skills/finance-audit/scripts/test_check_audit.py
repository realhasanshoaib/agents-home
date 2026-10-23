import copy
import unittest
from check_audit import check


class AuditChecks(unittest.TestCase):
    def setUp(self):
        self.data = {'rows': [{'id': 'team-plan', 'venture': 'collabez', 'account': 'team', 'lo': 10, 'hi': 10}],
                     'kaadr': [], 'unknown': [['Unread tenant', 'No invoice']], 'totals': {'lo': 10, 'hi': 10}}
        self.inventory = {'priced': [{'scope': 'main', 'id': 'team-plan', 'venture': 'collabez', 'account': 'team', 'monthly_usd': 10}],
                          'unpriced': ['Unread tenant'], 'growth_required': ['dev']}

    def test_missing_subscription_fails_even_when_total_was_recomputed(self):
        self.data['rows'] = []
        self.data['totals'] = {'lo': 0, 'hi': 0}
        self.assertIn('Known cost omitted', ' '.join(check(self.data, self.inventory, [])['errors']))

    def test_duplicate_and_wrong_account_fail(self):
        self.data['rows'].append(copy.deepcopy(self.data['rows'][0]))
        self.data['rows'][1]['account'] = 'wrong-team'
        errors = ' '.join(check(self.data, self.inventory, [])['errors'])
        self.assertIn('Duplicate', errors)
        self.assertIn('Account differs', errors)

    def test_old_price_and_disappearing_unknown_fail(self):
        self.data['rows'][0].update(lo=5, hi=5)
        self.data['totals'] = {'lo': 5, 'hi': 5}
        self.data['unknown'] = []
        errors = ' '.join(check(self.data, self.inventory, [])['errors'])
        self.assertIn('recurring amount differs', errors)
        self.assertIn('Unpriced coverage', errors)

    def test_comparable_growth_and_new_charge_are_flagged(self):
        observation = {'id': 'dev', 'comparison': 'comparable', 'kind': 'consumption', 'unit': 'USD/day',
                       'previous': .5, 'current': 3.3, 'source': 'meter.json', 'asof': '2026-10-23',
                       'previous_window': '2026-10-17/2026-10-20', 'current_window': '2026-10-20/2026-10-23'}
        result = check(self.data, self.inventory, [observation])
        self.assertTrue(result['valid'])
        self.assertEqual(result['growth_flags'][0]['daily_increase_usd'], 2.8)
        observation.update(previous=0, current=.1)
        self.assertEqual(len(check(self.data, self.inventory, [observation])['growth_flags']), 1)
        observation.update(previous=3.3, current=.5)
        self.assertEqual(check(self.data, self.inventory, [observation])['growth_flags'], [])

    def test_missing_data_is_not_no_growth_and_funding_is_rejected(self):
        result = check(self.data, self.inventory, [{'id': 'dev', 'comparison': 'blocked', 'reason': '401'}])
        self.assertEqual(result['growth_coverage_gaps'][0]['reason'], '401')
        self.assertFalse(check(self.data, self.inventory, [{'id': 'wallet', 'comparison': 'comparable',
                                                          'kind': 'funding', 'unit': 'USD/day'}])['valid'])

    def test_dropped_growth_observation_remains_incomplete(self):
        self.inventory['growth_required'] = ['dev', 'production']
        result = check(self.data, self.inventory, [])
        self.assertEqual({gap['id'] for gap in result['growth_coverage_gaps']}, {'dev', 'production'})

    def test_overlapping_future_and_unequal_windows_fail(self):
        observation = {'id': 'dev', 'comparison': 'comparable', 'kind': 'consumption', 'unit': 'USD/day',
                       'previous': 1, 'current': 7, 'source': 'meter.json', 'asof': '2026-10-23',
                       'previous_window': '2026-10-01/2026-10-10'}
        for window in ['2026-10-01/2026-11-01', '2026-10-10/2026-10-24', '2026-10-10/2026-10-12']:
            observation['current_window'] = window
            result = check(self.data, self.inventory, [observation])
            self.assertFalse(result['valid'])
            self.assertEqual(result['growth_flags'], [])


if __name__ == '__main__':
    unittest.main()
