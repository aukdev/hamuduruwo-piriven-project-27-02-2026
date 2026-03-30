import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { VisionMissionComponent } from './vision-mission/vision-mission.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsComponent } from './terms/terms.component';
import { VideosComponent } from './videos/videos.component';
import { VcharaComponent } from './vichara/vichara.component';

export const PUBLIC_ROUTES: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'vision-mission', component: VisionMissionComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'vichara', component: VcharaComponent },
];
