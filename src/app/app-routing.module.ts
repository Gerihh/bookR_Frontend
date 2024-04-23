import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { ElementComponent } from './element/element.component';

const routes: Routes = [
  {path: '', component: BookComponent},
  {path: 'elements/:title', component:ElementComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
