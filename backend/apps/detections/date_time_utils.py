from datetime import datetime

DATE_TIME_FORMAT = '%Y-%m-%d_%H-%M-%S-%f'


def get_date_time_tag():
    """Returns a datetime tag in the following example format '2019-04-01_20-24-13-535342'."""
    curr_time = datetime.now()
    return curr_time.strftime(DATE_TIME_FORMAT)


def date_time_to_str(date_time: datetime):
    """Transforms a datetime object into string."""
    return date_time.strftime(DATE_TIME_FORMAT)


def load_datetime_from_string_tag(input_string):
    """Given a date time tag in string, parse the date time object."""
    return datetime.strptime(input_string, DATE_TIME_FORMAT)


class DateTimeRange:
    def __init__(self, start: datetime, end: datetime) -> None:
        self.start = start
        self.end = end

    def contains(self, other_date_time: datetime) -> bool:
        return self.end > other_date_time > self.start
