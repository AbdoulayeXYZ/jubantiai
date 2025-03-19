import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './portal/components/connexion/connexion.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule)
  },
  {
    path: 'teacher',
    loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
    canActivate: [AuthGuard],
    data: { role: 'teacher' }
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
    canActivate: [AuthGuard],
    data: { role: 'student' }
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes),
    FormsModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
