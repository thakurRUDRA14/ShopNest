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
        const removeFields = ["keyword", "page", "limit", "resultsPerPage", "sort", "order"];
        removeFields.forEach((key) => delete queryCopy[key]);


        //filter for price
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);


        this.query = this.query.find(JSON.parse(queryStr))

        return this;
    }

    sort() {
        const sortBy = this.queryStr.sort ? this.queryStr.sort : "createdAt";
        const sortOrder = this.queryStr.order === 'asc' ? 1 : -1;
        this.query = this.query.sort({ [sortBy]: sortOrder });
        return this;
    }

    pagination() {
        const resultsPerPage = Number(this.queryStr.resultsPerPage) || 8;
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultsPerPage * (currentPage - 1)

        this.query = this.query.limit(resultsPerPage).skip(skip);
        return this;
    }
}

export { ApiFeatures }