import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GraphqlService } from './graphql.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GraphQLModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  providers: [GraphqlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
