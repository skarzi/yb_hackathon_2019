import importlib

import flask

BLUEPRINT_RELATIVE_IMPORTS = {
    '.urls': ('.views',),
    # TODO: uncomment for websocket support
    # '.routing': ('.consumers',),
    '.models': (),
    '.hooks': (),
    '.exceptions': (),
}


def try_import_module(*args, **kwargs):
    try:
        importlib.import_module(*args, **kwargs)
        return True
    except ModuleNotFoundError:
        return False


def register_blueprint(flask_app: flask.Flask, blueprint_path: str) -> None:
    blueprint_module, blueprint_name = blueprint_path.rsplit(':', 1)
    blueprint = getattr(
        importlib.import_module(blueprint_module),
        blueprint_name,
    )
    # TODO: refactor it to be more intelligent and raise better exceptions
    with flask_app.app_context():
        for module, fallback_modules in BLUEPRINT_RELATIVE_IMPORTS.items():
            if not try_import_module(module, blueprint.import_name):
                any(
                    try_import_module(module, blueprint.import_name)
                    for module in fallback_modules
                )

    flask_app.register_blueprint(blueprint)
