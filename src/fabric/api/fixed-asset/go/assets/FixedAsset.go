package assets

// FixedAsset - fixed asset
type FixedAsset struct {
	Doctype  string `json:"docType"`
	UUID     string `json:"uuid"`
	Creator  string `json:"creator"`
	Bytesize int    `json:"bytesize"`
	Content  string `json:"content"`
}
