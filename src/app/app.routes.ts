import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { Login } from './login/login';
import { User } from './user/user';
import { Cart } from './cart/cart';
import { Signup } from './signup/signup';
import { About } from './about/about';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'details/:permalink', component: Details},
    {path: 'login', component: Login},
    {path: 'user', component: User},
    {path: 'cart', component: Cart},
    {path: 'signup', component: Signup},
    {path: 'about', component: About}
];
