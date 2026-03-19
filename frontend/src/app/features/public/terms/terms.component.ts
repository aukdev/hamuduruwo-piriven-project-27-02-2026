import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent {}
