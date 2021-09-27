export class AuditMasterModel {
    Id!: number;
    auditID!: string;
    remark!: string;
    warehouseID!: number;
    warehouseCode!: string;

    WarehouseName!: string;

    SystemLocationID!: number;
    SystemLocationCode!: string;
    SystemLocationName!: string;
    ScanLocationID!: number;
    ScanLocationCode!: string;
    ScanLocationName!: string;
    SerialNumber!: string;
    ReleasedBy!: string;
    ReleasedDate!: Date;
    ClosedBy!: string;

    ClosedDate!: Date;

    PostedBy!: string;

    PostedDate!: Date;

    CreatedBy!: string;

    CreatedDate!: Date;

    Status!: number;

    StatusText!: string;

    ItemID!: number;
    ItemCode!: string;

    ItemName!: string;

    ScannedBy!: string;

    ScannedDate!: Date;

    CandidateLocationID!: number;

    CandidateLocationCode!: string;

    CandidateLocationName!: string;
    ModifiedBy!: string;

    ModifiedDate!: Date;

    toBeAuditedOn!: Date;

    companyID!: string;
    LineStatus!: number;
}
