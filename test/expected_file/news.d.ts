declare namespace schema {
    //  * example: 2012-01-01T12:00:00Z
    export type Date = string /* date-time */ ;
    // unique id of news article
    //  * example: 1
    export type Id = number;
    // article's title
    //  * example: Lexus Golf Activities in Full Swing at U.S.
    export type Title = string;
    // article's date
    //  * example: June 09, 2014
    export type Time = string;
    // article's detail text ( is linefeed character.)
    // example:
    //    line1.
    //   line2.
    export type Detail = string;
    // article's image url
    //  * example: http://pressroom.lexus.com/images/Lexus_logo_bug_2013_thumb_20140604144404730.jpg
    export interface ImageUrl {}
    // article's page url for hs
    //  * example: http://bento.uievolution.co.jp/static/news/201406140001.html
    export interface DetailUrl {}
    // when news was created
    export type CreatedAt = Date;
    // when news was updated
    export type UpdatedAt = Date;
    // News data API
    export interface News {
        id?: Id;
        title: Title;
        time: Time;
        detail: Detail;
        imageUrl?: ImageUrl;
        detailUrl?: DetailUrl;
        createdAt?: CreatedAt;
        updatedAt?: UpdatedAt;
    }
}
