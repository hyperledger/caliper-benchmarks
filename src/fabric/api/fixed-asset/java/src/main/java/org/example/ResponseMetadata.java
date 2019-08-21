package org.example;

import org.hyperledger.fabric.protos.peer.ChaincodeShim.QueryResponseMetadata;

public class ResponseMetadata {
    private int RecordsCount;
    private String Bookmark;

    public ResponseMetadata(QueryResponseMetadata metadata) {
        this.RecordsCount = metadata.getFetchedRecordsCount();
        this.Bookmark = metadata.getBookmark();
    }

    public int getRecordsCount() {
        return RecordsCount;
    }

    public void setRecordsCount(int recordsCount) {
        RecordsCount = recordsCount;
    }

    public String getBookmark() {
        return Bookmark;
    }

    public void setBookmark(String bookmark) {
        Bookmark = bookmark;
    }
}
