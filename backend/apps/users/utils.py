import base64
import io
import typing

import qrcode

from apps.detections import enums

from . import models

QR_CODE_SETTINGS = {
    'general': {
        'error_correction': qrcode.constants.ERROR_CORRECT_M,
        'box_size': 10,
        'border': 2,
    },
    'colors': {
        'fill_color': '#000000',
        'back_color': '#ffffff',
    },
    'format': 'PNG',
}

def qr_code_with(data: str, stringify: bool = False) -> typing.AnyStr:
    qr_code = qrcode.QRCode(**QR_CODE_SETTINGS['general'])
    qr_code.add_data(data)
    qr_code.make(fit=True)
    qr_code_image = qr_code.make_image(**QR_CODE_SETTINGS['colors'])
    image_stream = io.BytesIO()
    qr_code_image.save(image_stream, format=QR_CODE_SETTINGS['format'])
    base64_image = base64.b64encode(image_stream.getvalue())
    return base64_image.decode('utf-8') if stringify else base64_image


def _get_amount_from(transaction):
    amount = abs(transaction.amount)
    if transaction.type == enums.TransactionType.INCOME:
        return amount
    elif transaction.type == enums.TransactionType.EXPENSE:
        return -amount
    return 0


def get_account_balance(user: models.User) -> float:
    return sum(
        _get_amount_from(transaction) for transaction in user.transactions
    )
