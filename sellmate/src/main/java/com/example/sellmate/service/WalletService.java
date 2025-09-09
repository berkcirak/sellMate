package com.example.sellmate.service;

import com.example.sellmate.dto.response.WalletResponse;
import com.example.sellmate.entity.Wallet;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.exception.wallet.WalletNotFoundException;
import com.example.sellmate.mapper.WalletMapper;
import com.example.sellmate.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class WalletService {

    private final UserService userService;
    private final WalletRepository walletRepository;
    private final WalletMapper walletMapper;

    public WalletService(UserService userService, WalletRepository walletRepository, WalletMapper walletMapper) {
        this.userService=userService;
        this.walletRepository=walletRepository;
        this.walletMapper = walletMapper;
    }

    @Transactional
    public WalletResponse deposit(BigDecimal amount){
        validateAmount(amount);
        Long userId = userService.getCurrentUserId();
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow(() -> new UnauthorizedException("Wallet not found"));
        wallet.deposit(amount);
        Wallet savedWallet = walletRepository.save(wallet);
        return walletMapper.toResponse(savedWallet);
    }
    @Transactional
    public WalletResponse withdraw(BigDecimal amount){
        validateAmount(amount);
        Long userId = userService.getCurrentUserId();
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow(() -> new UnauthorizedException("Wallet not found"));
        BigDecimal normalizedAmount = normalize(amount);
        if (wallet.getBalance().compareTo(normalizedAmount) < 0){
            throw new IllegalArgumentException("Insufficient balance");
        }
        wallet.withdraw(normalizedAmount);
        Wallet savedWallet = walletRepository.save(wallet);
        return walletMapper.toResponse(savedWallet);
    }
    public WalletResponse getMyWallet(){
        Long userId = userService.getCurrentUserId();
        Wallet myWallet = walletRepository.findByUserId(userId).orElseThrow(() -> new WalletNotFoundException("Wallet not found"));
        return walletMapper.toResponse(myWallet);
    }

    private void validateAmount(BigDecimal amount){
        if (amount == null || amount.signum() <= 0){
            throw new IllegalArgumentException("Amount must be positive");
        }
    }
    private BigDecimal normalize(BigDecimal amount){
        return amount.setScale(2, RoundingMode.HALF_UP);
    }



}
