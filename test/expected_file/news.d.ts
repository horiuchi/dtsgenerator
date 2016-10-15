declare namespace Schema {
    /**
     * News data API
     */
    export interface News {
        id?: News.Definitions.Id;
        title: News.Definitions.Title;
        time: News.Definitions.Time;
        detail: News.Definitions.Detail;
        imageUrl?: News.Definitions.ImageUrl; // uri
        detailUrl?: News.Definitions.DetailUrl; // uri
        createdAt?: News.Definitions.CreatedAt;
        updatedAt?: News.Definitions.UpdatedAt;
    }
    namespace News {
        namespace Definitions {
            /**
             * when news was created
             */
            export type CreatedAt = Date; // date-time
            /**
             * example: 2012-01-01T12:00:00Z
             */
            export type Date = string; // date-time
            /**
             * article's detail text ( is linefeed character.)
             * example:
             *    line1.
             *   line2.
             */
            export type Detail = string;
            /**
             * article's page url for hs
             * example: http://www.example.com/static/news/201406140001.html
             */
            export type DetailUrl = string | null; // uri
            /**
             * unique id of news article
             * example: 1
             */
            export type Id = number;
            /**
             * article's image url
             * example: http://image.example.com/images/logo_bug_2013_thumb_20140604144404730.jpg
             */
            export type ImageUrl = string | null; // uri
            /**
             * article's date
             * example: June 09, 2014
             */
            export type Time = string;
            /**
             * article's title
             * example: Activities in Full Swing at U.S.
             */
            export type Title = string;
            /**
             * when news was updated
             */
            export type UpdatedAt = Date; // date-time
        }
    }
}
