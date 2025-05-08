import { Component, OnInit, ViewChild, HostListener, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, query, transition, stagger, animate } from '@angular/animations'
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormControl } from '@angular/forms';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThisReceiver } from '@angular/compiler';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger("animateMenu", [
      transition(":enter", [
        query("*", [
          style({ opacity: 0, transform: "translateY(-50%)" }),
          stagger(50, [
            animate(
              "250ms cubic-bezier(0.35, 0, 0.25, 1)",
              style({ opacity: 1, transform: "none" }))
          ])
        ])
      ])
    ])
  ]
})



export class HeaderComponent implements OnInit {

  responsiveMenuVisible: Boolean = false;
  pageYPosition: number;
  languageFormControl: UntypedFormControl = new UntypedFormControl();
  cvName: string = "";

  constructor(
    private router: Router,
    public analyticsService: AnalyticsService,
    public languageService: LanguageService,
    private renderer: Renderer2, @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {

    this.languageFormControl.valueChanges.subscribe(val => this.languageService.changeLanguage(val))

    this.languageFormControl.setValue(this.languageService.language)

  }

  scroll(el) {
    if (document.getElementById(el)) {
      document.getElementById(el).scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/home']).then(() => document.getElementById(el).scrollIntoView({ behavior: 'smooth' }));
    }
    this.responsiveMenuVisible = false;
  }

  downloadCV() {
    this.languageService.translateService.get("Header.cvName").subscribe(val => {
      this.cvName = val;
      const cvUrl = `assets/cv/${this.cvName}`;  // Relative path without baseUrl
  
      // Dynamically create an anchor element
      const anchor = this.renderer.createElement('a');
      this.renderer.setAttribute(anchor, 'href', cvUrl);
      this.renderer.setAttribute(anchor, 'download', this.cvName);
  
      // Append the anchor to the document body
      this.renderer.appendChild(this.document.body, anchor);
  
      // Trigger a click event to download the file
      anchor.click();
  
      // Remove the anchor after download to clean up
      this.renderer.removeChild(this.document.body, anchor);
    });
  }
  
  @HostListener('window:scroll', ['getScrollPosition($event)'])
  getScrollPosition(event) {
    this.pageYPosition = window.pageYOffset
  }

  changeLanguage(language: string) {
    this.languageFormControl.setValue(language);
  }

  chatBot() {
    this.router.navigate(['chat'])

  }

}
