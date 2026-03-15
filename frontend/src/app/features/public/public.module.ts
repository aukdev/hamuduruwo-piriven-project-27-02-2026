import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { VisionMissionComponent } from './vision-mission/vision-mission.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'vision-mission', component: VisionMissionComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent },
];

@NgModule({
  declarations: [
    AboutComponent,
    ContactComponent,
    VisionMissionComponent,
    PrivacyPolicyComponent,
    TermsComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PublicModule {}
