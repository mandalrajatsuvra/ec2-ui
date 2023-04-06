import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
  newsData: any[];
  constructor( private httpClient: HttpClient) { }

  ngOnInit(): void {

    let httpParam: HttpParams = new HttpParams();
    httpParam = httpParam.append('sources', 'google-news');
    httpParam = httpParam.append('apiKey', '78abea7c58084e3d8e7ea75544da4add');


    this.httpClient.get('http://newsapi.org/v2/top-headlines', { observe: 'body', params: httpParam})
          .subscribe((data: any) => {
            console.log(data);
            this.newsData = data.articles;
    });

  }

}
