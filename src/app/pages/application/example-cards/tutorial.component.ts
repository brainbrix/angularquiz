import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

import { SeoService } from '../../../services/seo/seo.service';
import { Feature } from './feature';
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {

  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  features: Array<Feature>;
  // @ts-ignore
  timer: NodeJS.Timer;

  question = {
    text: "",
    answers: new Array(),
    correct:0,
    timeout: 0
  }

  questions = [
    {
      "id": "87",
      "question": "Who won the Academy Award (Oscar) for Best Director in the year 1957?",
      "answer1": "George Stevens",
      "answer2": "Billy Wilder",
      "answer3": "James Cameron",
      "answer4": "Steven Soderbergh",
      "correct": 1,
      "categories": "Cinema, Film",
      "language": "en",
      "difficulty": "8",
      "category_id": ";F200;",
      "info": "",
      "created": "2023-05-21 16:29:26"
    },
    {
      "id": "2931",
      "question": "Who was the quarterback when the Washington Redskins won the Super Bowl in 1992?",
      "answer1": "Mark Rypien",
      "answer2": "Peyton Manning",
      "answer3": "Nick Foles",
      "answer4": "Joe Montana",
      "correct": 0,
      "categories": "American Football",
      "language": "en",
      "difficulty": "6",
      "category_id": ";S500;",
      "info": "",
      "created": "2023-05-21 16:31:35"
    }
  ]; // Global Array of Objects (each Object representing a Question)
  stats = {
    questionsAsked: 0,
    correct: 0,
    correctStreak: 0,
    currentTime: null,
    averageResponseTime: 1.2,
    currentQuestion:0,
    selectedAnswer :-1
  };
  // @ts-ignore
  private subscription: Subscription;

  constructor(
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: object) {

    this.features =
      [
        {
          type: 'CRUD',
          description: 'CRUD , API Rest, Components, Pages, Extends',
          image: 'demo-responsive-images-list.png',
          link: 'crud'
        },
        {
          type: 'Services',
          description: 'Use services to view a playlist and a youtube player',
          image: 'demo-services-playlist-youtube.png',
          link: 'services'
        },
        {
          type: 'Components',
          description: 'Channel Component with Input, Output and Event Emitter',
          image: 'demo-components.png',
          link: 'components'
        },
        {
          type: 'HttpClient',
          description: 'Use an external API with the HttpClient module',
          image: 'demo-httpclient.png',
          link: 'httpclient'
        },
        {
          type: 'Reactive Form',
          description: 'A model-driven approach to handling form inputs',
          image: 'demo-reactive-forms.png',
          link: 'forms'
        },
        {
          type: 'Template Driven Forms',
          description: 'Forms are the mainstay of business applications',
          image: 'demo-template-driven-forms.png',
          link: 'forms'
        },
        {
          type: 'Modal',
          description: 'How to implement modal windows with Angular and Bootstrap',
          image: 'demo-template-driven-forms.png',
          link: 'modal'
        },
        {
          type: 'Prism',
          description: 'Use a lightweight, extensible syntax highlighter',
          image: 'demo-template-driven-forms.png',
          link: 'prism'
        },
      ];


  }

  ngOnInit(): void {

    const content =
      'Cette application a été développée avec Angular version 17.0.6 et bootstrap 5.3.2' +
      ' Elle applique le Routing, le Lazy loading, le Server side rendering et les Progressive Web App (PWA)';

    const title = 'angular-starter Title : Angular Page';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
    this.prepareQuestion(0);

    this.subscription = interval(1000).subscribe(x => {
      this.tickTock();
      // ...some code goes here....
    });


  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadScript(name: string): void {

    if (isPlatformBrowser(this.platformId)) {
      const src = document.createElement('script');
      src.type = 'text/javascript';
      src.src = name;
      src.async = false;
      document.getElementsByTagName('head')[0].appendChild(src);
    }
  }

  prepareQuestion( questionId: number ) {
    console.log("Prepare: " + questionId);
    this.question.text = this.questions[questionId].question;
    this.stats.selectedAnswer = -1;
    this.question.answers = new Array();
    this.stats.currentQuestion = questionId;
    this.question.timeout = 10;
    this.question.answers.push( this.questions[questionId].answer1 );
    this.question.answers.push( this.questions[questionId].answer2 );
    this.question.answers.push( this.questions[questionId].answer3 );
    this.question.answers.push( this.questions[questionId].answer4 );
    this.question.correct = this.questions[questionId].correct;
  }

  getCssClasses(index : number) {
    var classes = "btn quiz-ans-btn animated fadein";
    if ( this.stats.selectedAnswer > -1 ) {
      //item == this.question.answers[this.question.correct])
      classes = classes + " fadeout";
      if (index == this.question.correct) {
        classes = classes + " pulse correct";
      } else if (index == this.stats.selectedAnswer && index != this.question.correct){
        classes = classes + " shake incorrect";
      }
    }
    return classes;
  }

  selectAnswer(index : number ) {
    if (this.stats.selectedAnswer == -1) {
      this.stats.selectedAnswer = index;
      this.stats.questionsAsked = this.stats.questionsAsked+1;
      if (index == this.question.correct) {
        this.stats.correct = this.stats.correct+1;
      }
      setTimeout(() => this.nextQuestion(), 2000);
      console.log("Selected: " + index);
    }
  }

  nextQuestion() {
    var nextQuestion = this.stats.currentQuestion +1;
    if (nextQuestion > 1 ) {
      nextQuestion = 0;
    }
    this.prepareQuestion(nextQuestion);
  }

  tickTock() {
    if (this.question.timeout <0)
      return;
    //console.log("Time:"+this.question.timeout);
    this.question.timeout = this.question.timeout-1;
    if (this.question.timeout <0) {
      this.selectAnswer(10);
    }
  }
}

