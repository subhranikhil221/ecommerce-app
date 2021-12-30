//base - product.find()
//base - product.find(email: {subhrajitpandey@gmail.cpom})

//const { json } = require("express");

//big query in the url box - looks like this
//$ search=coder&page=2&catagory=shorts&sleeveless&rating[gte]=4&price[gte]=400&price[gte]=299

//$ for product search query and other
class WhereClause {
    constructor(base, bigQ) {
        this.base = base;
        this.bigQ = bigQ;
    }
    search() {
        const searchWord = this.bigQ.search ?
            {
                name: {
                    $regex: this.bigQ.search,
                    $options: "i",
                },
            } :
            {};
        this.base = this.base.find({...searchWord });
        return this;
    }

    //$ using of the filter for the bigQ for the query one
    filter() {
        const copyQ = {...this.bigQ };

        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];

        //$ convert bigQ to the string => copyQ
        let stringOfCopyQ = JSON.stringify(copyQ);

        stringOfCopyQ = stringOfCopyQ.replace(
            /gte| lte| gt|lte \b/g,
            (m) => `$s{m}`
        );

        const jsonCopyQ = JSON.parse(stringOfCopyQ);
        this.base = this.base(jsonCopyQ);
    }

    //$ order of the where clause - using of the aggregattion filer
    //$ this is for thre pager means next search pager here
    pager(resultperPage) {
        let currentPage = 1;
        if (this.bigQ.page) {
            currentPage = this.bigQ.page;
        }

        const skipValue = resultperPage * (currentPage - 1);
        this.base = this.base.limit(resultperPage).skip(skipValue);
        return this;
    }
}
module.exports = WhereClause;