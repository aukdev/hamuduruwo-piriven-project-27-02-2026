import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {}
