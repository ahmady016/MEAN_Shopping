import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
import { env } from './environments/environment';

if (env.production)
  enableProdMode();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
