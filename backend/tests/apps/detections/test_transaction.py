import unittest
from datetime import datetime, timedelta
from pprint import pprint
from random import randrange

from backend.apps.detections import transaction
from backend.apps.detections.date_time_utils import DateTimeRange
from backend.apps.detections.transaction import Rejection, Income, Expense


class TestTransactionHistory(unittest.TestCase):
    def setUp(self) -> None:
        max_amount = 100
        n_incomes = 5
        n_expenses = 10
        n_rejections = 15
        history = transaction.TransactionHistory()
        self.total_income, self.total_expenses, self.total_rejections = 0, 0, 0
        for n in range(n_incomes):
            amount = randrange(max_amount)
            self.total_income += amount
            history.add_transaction(transaction.Income(amount))
        for n in range(n_expenses):
            amount = randrange(max_amount)
            self.total_expenses += amount
            history.add_transaction(transaction.Expense(amount))
        for n in range(n_rejections):
            amount = randrange(max_amount)
            self.total_rejections += amount
            history.add_transaction(transaction.Rejection(amount))
        self.history = history

    def test_print_history(self):
        print(f'Printing the transaction history...')
        summary = self.history.get_summary(DateTimeRange(datetime.now() - timedelta(seconds=5), datetime.now()))
        pprint(summary)

    def test_num_of_transactions(self):
        pass

if __name__ == '__main__':
    unittest.main()