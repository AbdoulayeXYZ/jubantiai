import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./portal/components/connexion/connexion.component').then(m => m.ConnexionComponent),
    children: [
      { path: 'login', loadComponent: () => import('./portal/components/login/login.component').then(m => m.LoginComponent) },
      {
        path: 'register',
        loadComponent: () => import('./portal/components/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'teacher',
    loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
    canActivate: [RoleGuard],
    data: { role: 'teacher' }
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
    canActivate: [RoleGuard],
    data: { role: 'student' }
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
