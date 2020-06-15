package org.example;

public class QueryResponse<T> {
    private T[] results;

    private ResponseMetadata responseMetadata;

    public QueryResponse(T[] results, ResponseMetadata responseMetadata) {
        this.results = results;
        this.responseMetadata = responseMetadata;
    }

    public T[] getResults() {
        return results;
    }

    public void setResults(T[] results) {
        this.results = results;
    }

    public ResponseMetadata getResponseMetadata() {
        return responseMetadata;
    }

    public void setResponseMetadata(ResponseMetadata responseMetadata) {
        this.responseMetadata = responseMetadata;
    }

}
