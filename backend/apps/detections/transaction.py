from datetime import datetime
from datetime import timedelta

from backend.apps.detections.date_time_utils import DateTimeRange, date_time_to_str

from typing import List


class DetectionObject:
    def __init__(self, x_pos: int, y_pos: int, width: int, height: int,
                 label: str, score: float, time_stamp: datetime = None) -> None:
        self.time_stamp = time_stamp if time_stamp else datetime.now()
        self.x_pos = x_pos
        self.y_pos = y_pos
        self.width = width
        self.height = height
        self.label = label
        self.score = score


class Transaction:
    def __init__(self, amount, created_at: datetime = None, trans_obj: DetectionObject = None) -> None:
        self.amount = amount
        self.created_at = created_at if created_at else datetime.now()
        self.trans_obj = trans_obj

    def to_dict(self, include_obj=False) -> dict:
        return {'created_at': date_time_to_str(self.created_at), 'amount': self.amount}


class Expense(Transaction):
    def __init__(self, amount):
        super().__init__(amount)


class Rejection(Transaction):
    def __init__(self, amount):
        super().__init__(amount)


class Income(Transaction):
    def __init__(self, amount):
        super().__init__(amount)

    #def trans_obj(self):
    #    raise RuntimeError('An Income is not related to a detection / transaction object.')


class TransactionHistory:
    def __init__(self, transactions: List[Transaction] = None):
        self.transactions = transactions if transactions else []

    def add_transaction(self, transaction: Transaction) -> None:
        self.transactions.append(transaction)

    @property
    def start_date_time(self) -> datetime:
        return min([trans.created_at for trans in self.transactions])

    @property
    def end_date_time(self) -> datetime:
        return max([trans.created_at for trans in self.transactions])

    @property
    def date_time_range(self) -> DateTimeRange:
        return DateTimeRange(start=self.start_date_time, end=self.end_date_time)

    def _get_transactions_in_range(self, date_time_range: DateTimeRange, type_filter) -> List[Transaction]:
        for transaction in self.transactions:
            if isinstance(transaction, type_filter) and date_time_range.contains(transaction.created_at):
                yield transaction

    def get_expenses_in_range(self, date_time_range: DateTimeRange) -> List[Expense]:
        yield from self._get_transactions_in_range(date_time_range, type_filter=Expense)

    def get_rejections_in_range(self, date_time_range: DateTimeRange) -> List[Rejection]:
        yield from self._get_transactions_in_range(date_time_range, type_filter=Rejection)

    def get_incomes_in_range(self, date_time_range: DateTimeRange) -> List[Income]:
        yield from self._get_transactions_in_range(date_time_range, type_filter=Income)

    def get_total_expense_in_range(self, date_time_range: DateTimeRange) -> float:
        return sum([exp.amount for exp in self.get_expenses_in_range(date_time_range)])

    def get_total_rejection_in_range(self, date_time_range: DateTimeRange) -> float:
        return sum([rej.amount for rej in self.get_rejections_in_range(date_time_range)])

    def get_total_income_in_range(self, date_time_range: DateTimeRange) -> float:
        return sum([inc.amount for inc in self.get_incomes_in_range(date_time_range)])

    def get_summary(self, date_time_range: DateTimeRange) -> dict:
        summary = {}
        for transaction_list, trans_type in [(self.get_expenses_in_range(date_time_range), 'expenses'),
                                             (self.get_rejections_in_range(date_time_range), 'rejections'),
                                             (self.get_incomes_in_range(date_time_range), 'incomes')]:
            summary[trans_type] = [transaction.to_dict() for transaction in transaction_list]
        return summary


if __name__ == '__main__':
    from time import sleep
    from pprint import pprint
    from random import randrange
    MAX_AMOUNT = 100
    history = TransactionHistory()
    for _ in range(15):
        money_val = randrange(100)
        pivot = randrange(30)
        if pivot < 10:
            history.add_transaction(Expense(money_val))
        elif pivot < 20:
            history.add_transaction(Income(money_val))
        elif pivot < 30:
            history.add_transaction(Rejection(money_val))

    pprint(history.get_summary(DateTimeRange(datetime.now() - timedelta(seconds=5), datetime.now())))



