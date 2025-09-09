package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.request.WalletAmountRequest;
import com.example.sellmate.dto.response.WalletResponse;
import com.example.sellmate.entity.Wallet;
import com.example.sellmate.service.WalletService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    private final WalletService walletService;
    public WalletController(WalletService walletService){
        this.walletService=walletService;
    }
    @PostMapping("/deposit")
    public ApiResponse<WalletResponse> depositWallet(@RequestBody WalletAmountRequest request, HttpServletRequest httpRequest){
        WalletResponse walletResponse = walletService.deposit(request.amount());
        return ApiResponse.success(walletResponse, "Deposit successfully", httpRequest.getRequestURI());
    }
    @PostMapping("/withdraw")
    public ApiResponse<WalletResponse> withdrawWallet(@RequestBody WalletAmountRequest request, HttpServletRequest httpRequest){
        WalletResponse walletResponse = walletService.withdraw(request.amount());
        return ApiResponse.success(walletResponse, "Withdraw successfully", httpRequest.getRequestURI());
    }

    @GetMapping("/my-wallet")
    public ApiResponse<WalletResponse> getMyWallet(HttpServletRequest httpRequest){
        WalletResponse wallet = walletService.getMyWallet();
        return ApiResponse.success(wallet, "Wallet retrieved successfully", httpRequest.getRequestURI());
    }




}
