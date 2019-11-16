import unittest
from datetime import datetime, timedelta
from pprint import pprint
from random import randrange

from backend.apps.detections import transaction
from backend.apps.detections.date_time_utils import DateTimeRange
from backend.apps.detections.transaction import Transaction, TransactionType


class TestTransactionHistory(unittest.TestCase):
    def setUp(self) -> None:
        max_amount = 100
        self.n_incomes = 5
        self.n_expenses = 10
        self.n_rejections = 15
        history = transaction.TransactionHistory()
        self.total_income, self.total_expenses, self.total_rejections = 0, 0, 0
        for n in range(self.n_incomes):
            amount = randrange(max_amount)
            self.total_income += amount
            history.add_transaction(Transaction(amount, TransactionType.INCOME))
        for n in range(self.n_expenses):
            amount = randrange(max_amount)
            self.total_expenses += amount
            history.add_transaction(Transaction(amount, TransactionType.EXPENSE))
        for n in range(self.n_rejections):
            amount = randrange(max_amount)
            self.total_rejections += amount
            history.add_transaction(Transaction(amount, TransactionType.REJECTION))
        self.history = history

    def test_print_history(self):
        print(f'Printing the transaction history...')
        summary = self.history.get_summary(DateTimeRange(datetime.now() - timedelta(seconds=5), datetime.now()))
        pprint(summary)

    def test_num_of_transactions(self):
        date_range = DateTimeRange(datetime.now() - timedelta(seconds=100), datetime.now())
        self.assertEqual(self.n_incomes, self.history.num_of_transactions(date_range, TransactionType.INCOME))
        self.assertEqual(self.n_rejections, self.history.num_of_transactions(date_range, TransactionType.REJECTION))
        self.assertEqual(self.n_expenses, self.history.num_of_transactions(date_range, TransactionType.EXPENSE))

    def test_total_amounts(self):
        date_range = DateTimeRange(datetime.now() - timedelta(seconds=100), datetime.now())
        self.assertEqual(self.total_income, self.history.get_total_amount_in_range(date_range, TransactionType.INCOME))
        self.assertEqual(self.total_rejections, self.history.get_total_amount_in_range(date_range, TransactionType.REJECTION))
        self.assertEqual(self.total_expenses, self.history.get_total_amount_in_range(date_range, TransactionType.EXPENSE))

    def print_hist(self):
        pass

if __name__ == '__main__':
    unittest.main()