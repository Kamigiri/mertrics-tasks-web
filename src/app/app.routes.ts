import { Routes } from '@angular/router';
import { TasksViewComponent } from './components/tasks/tasks-view.component';
import { HabitsComponent } from './components/habits/habits.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks/today',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    children: [
      {
        path: 'today',
        component: TasksViewComponent
      },
      {
        path: 'upcoming',
        component: TasksViewComponent
      },
      {
        path: 'all',
        component: TasksViewComponent
      },
      {
        path: 'list/:id',
        component: TasksViewComponent
      },
      {
        path: '',
        redirectTo: 'today',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'habits',
    component: HabitsComponent
  },
  {
    path: '**',
    redirectTo: '/tasks/today'
  }
];
