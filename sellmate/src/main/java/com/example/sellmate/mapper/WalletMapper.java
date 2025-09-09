package com.example.sellmate.mapper;

import com.example.sellmate.dto.response.WalletResponse;
import com.example.sellmate.entity.Wallet;
import org.springframework.stereotype.Component;

@Component
public class WalletMapper {
    public WalletResponse toResponse(Wallet wallet){
        return new WalletResponse(wallet.getBalance(), wallet.getCurrency());
    }
}
