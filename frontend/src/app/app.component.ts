import { Component } from '@angular/core';

// components
import { UsersComponent } from './users/users.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { TasksComponent } from './tasks/tasks.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [UsersComponent, RegisterComponent, LoginComponent, TasksComponent, HeaderComponent]
})
export class AppComponent {}
