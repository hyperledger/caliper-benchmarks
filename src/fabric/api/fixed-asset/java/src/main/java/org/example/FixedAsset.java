/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.example;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONObject;

@DataType()
public class FixedAsset {

    @Property()
    private String uuid;

    @Property()
    private String creator;

    @Property()
    private int byteSize;

    @Property()
    private String content;

    public FixedAsset(){
    }



    public String toJSONString() {
        return new JSONObject(this).toString();
    }

    public static FixedAsset fromJSONString(String json) {
        String uuid = new JSONObject(json).getString("uuid");
        String creator = new JSONObject(json).getString("creator");
        int byteSize = new JSONObject(json).getInt("byteSize");
        String content = new JSONObject(json).getString("content");
        FixedAsset asset = new FixedAsset();
        asset.setUuid(uuid);
        asset.setCreator(creator);
        asset.setBytesize(byteSize);
        asset.setContent(content);

        return asset;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public int getBytesize() {
        return byteSize;
    }

    public void setBytesize(int byteSize) {
        this.byteSize = byteSize;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
