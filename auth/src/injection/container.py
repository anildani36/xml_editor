from dependency_injector import containers, providers

from src.config.db_connection_config import SessionLocal
from src.service.auth_service import AuthService
from src.service.database.user_db_service import UserDbService
from src.controllers.auth_controller import AuthController


class Gateways(containers.DeclarativeContainer):
    pass


class Services(containers.DeclarativeContainer):
    gateways = providers.DependenciesContainer()

    db_session = providers.Dependency()

    user_db_service = providers.Factory(
        UserDbService,
        db=db_session
    )

    auth_service = providers.Factory(
        AuthService,
        user_db_service=user_db_service
    )

    auth_controller = providers.Factory(
        AuthController,
        auth_service=auth_service
    )


class Application(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(modules=[
        'src.routes.authentication_routes'
    ])

    db_session = providers.Factory(SessionLocal)

    gateways = providers.Container(
        Gateways
    )

    services = providers.Container(
        Services,
        gateways=gateways,
        db_session=db_session,
    )


# container = Application()
# container.wire(modules=[__name__])