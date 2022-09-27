import ReactDOM from 'react-dom/client';

import RootModule from './modules';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css'

const bootstrap = async () => {
  await RootModule.initialize()

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(<App routes={RootModule.routes} navItems={RootModule.navItems}/>);
}

bootstrap().catch(console.error)
