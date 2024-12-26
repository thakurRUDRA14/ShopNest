class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,   // to search object which contain that word
                $options: 'i',    // to make it case insensitive
            },
        } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        // const queryStr=this.queryStr              // this will pass reference to queryStr do not create copy
        const queryCopy = { ...this.queryStr }       //this will create copy

        // Removing some field for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);


        //filter for price
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);


        this.query = this.query.find(JSON.parse(queryStr))

        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export { ApiFeatures }