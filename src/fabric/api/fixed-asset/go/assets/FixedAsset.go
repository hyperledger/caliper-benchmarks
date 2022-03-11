package assets

// FixedAsset - fixed asset
type FixedAsset struct {
	Doctype  string `json:"docType"`
	UUID     string `json:"uuid"`
	Creator  string `json:"creator"`
	Bytesize int    `json:"byteSize"`
	Content  string `json:"content"`
}

type PrivateAssetContent struct {
	Content FixedAsset `json:"content"`
}
