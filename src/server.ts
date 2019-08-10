import clsHooked from 'cls-hooked';
import errorhandler from 'errorhandler';
import app from './app';
import { ServiceRegistry } from './services/ServiceRegistry';

/*
app.use(errorhandler());

const server = app.listen(app.get('port'), 'localhost', () => {
    console.log(
        `Drakolis.PW started at localhost:${app.get('port')} (env: ${app.get('env')})`,
    );

});

export default server;
*/

new ServiceRegistry().startServices();
