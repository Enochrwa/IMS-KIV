package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AddStoreSupplierResponse {
    private String id;
    private String companyId;
    private String name;
    private Address address;
    private String status;
    private List<String> supplierIds;

    public AddStoreSupplierResponse() {
    }
}
