package org.example.expensetracker.controller;

import org.example.expensetracker.model.Budget;
import org.example.expensetracker.model.User;
import org.example.expensetracker.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Budget budget, Authentication authentication) {
        try {
            logger.info("Creating budget for user: {}", authentication.getName());
            logger.info("Budget data: {}", budget);
            
            // Get the current user
            User currentUser = new User();
            currentUser.setId(getUserId(authentication));
            
            // Set the user in the budget
            budget.setUser(currentUser);
            
            // Log the budget after setting the user
            logger.info("Budget with user set: {}", budget);
            
            Budget savedBudget = budgetService.createBudget(budget);
            logger.info("Budget created successfully with ID: {}", savedBudget.getId());
            return ResponseEntity.ok(savedBudget);
        } catch (Exception e) {
            logger.error("Error creating budget: ", e);
            return ResponseEntity.badRequest().body("Failed to create budget: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserBudgets(Authentication authentication) {
        try {
            logger.info("Fetching budgets for user: {}", authentication.getName());
            return ResponseEntity.ok(budgetService.getUserBudgets(getUserId(authentication)));
        } catch (Exception e) {
            logger.error("Error fetching budgets: ", e);
            return ResponseEntity.badRequest().body("Failed to fetch budgets: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(@PathVariable Long id, @RequestBody Budget budget, Authentication authentication) {
        try {
            logger.info("Updating budget {} for user: {}", id, authentication.getName());
            return ResponseEntity.ok(budgetService.updateBudget(id, budget));
        } catch (Exception e) {
            logger.error("Error updating budget: ", e);
            return ResponseEntity.badRequest().body("Failed to update budget: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id, Authentication authentication) {
        try {
            logger.info("Deleting budget {} for user: {}", id, authentication.getName());
            budgetService.deleteBudget(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting budget: ", e);
            return ResponseEntity.badRequest().body("Failed to delete budget: " + e.getMessage());
        }
    }

    @GetMapping("/{category}/status")
    public ResponseEntity<?> getBudgetStatus(
            @PathVariable String category,
            Authentication authentication) {
        try {
            logger.info("Fetching budget status for category {} and user: {}", category, authentication.getName());
            return ResponseEntity.ok(budgetService.getBudgetStatus(getUserId(authentication), category));
        } catch (Exception e) {
            logger.error("Error fetching budget status: ", e);
            return ResponseEntity.badRequest().body("Failed to fetch budget status: " + e.getMessage());
        }
    }

    private Long getUserId(Authentication authentication) {
        // This should be implemented based on your user authentication setup
        // For now, we'll return a default user ID
        return 1L;
    }
} 