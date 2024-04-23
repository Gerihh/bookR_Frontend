import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { ElementComponent } from './element/element.component';
import { NodeComponent } from './node/node.component';

const routes: Routes = [
  {path: '', component: BookComponent},
  {path: ':title/elements', component:ElementComponent},
  {path: ':title/:name/nodes', component: NodeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
