package com.orderpay.payload.request;
import java.util.List;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class OrderRequest {
    @NotEmpty
    private List<OrderItemRequest> items;
}
