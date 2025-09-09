package com.example.sellmate.dto.response;

import java.math.BigDecimal;

public record WalletResponse(BigDecimal balance, String currency) {
}
