from datetime import datetime
from datetime import timedelta
from backend.apps.detections.enums import TransactionType

from backend.apps.detections.date_time_utils import DateTimeRange, date_time_to_str

from typing import List


TRANS_TYPE_NAMES = {
    TransactionType.EXPENSE: 'expenses',
    TransactionType.INCOME: 'income',
    TransactionType.REJECTION: 'rejections'
}


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
    def __init__(self, amount, trans_type: TransactionType,
                 created_at: datetime = None, trans_obj: DetectionObject = None) -> None:
        self.amount = amount
        self.trans_type = trans_type
        self.created_at = created_at if created_at else datetime.now()
        self.trans_obj = trans_obj

    def to_dict(self, include_obj=False) -> dict:
        return {'created_at': date_time_to_str(self.created_at), 'amount': self.amount}


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
    def dt_range(self) -> DateTimeRange:
        return DateTimeRange(start=self.start_date_time, end=self.end_date_time)

    def get_transactions_in_range(self, dt_range: DateTimeRange, trans_type: TransactionType) -> List[TransactionType]:
        for transaction in self.transactions:
            if transaction.trans_type == trans_type and dt_range.contains(transaction.created_at):
                yield transaction
    
    def get_total_amount_in_range(self, dt_range: DateTimeRange, trans_type: TransactionType) -> float:
        return sum([trans.amount for trans in self.get_transactions_in_range(dt_range, trans_type)])

    def num_of_transactions(self, dt_range: DateTimeRange, trans_type: TransactionType) -> int:
        return len(list(self.get_transactions_in_range(dt_range, trans_type)))

    def get_summary(self, dt_range: DateTimeRange) -> dict:
        summary = {}

        for trans_type, trans_name in TRANS_TYPE_NAMES.items():
            summary[trans_name] = [trans.to_dict() for trans in self.get_transactions_in_range(dt_range, trans_type)]
        return summary


if __name__ == '__main__':
    pass



