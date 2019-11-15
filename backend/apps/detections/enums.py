import enum


class TransactionType(enum.IntEnum):
    EXPENSE = 0
    INCOME = 1
    REJECTION = 2
