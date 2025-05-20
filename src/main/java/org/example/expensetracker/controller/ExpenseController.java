package org.example.expensetracker.controller;

import org.example.expensetracker.model.Expense;
import org.example.expensetracker.model.User;
import org.example.expensetracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @GetMapping("/{id}")
    public Optional<Expense> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }

    @PostMapping
    public ResponseEntity<?> createExpense(@RequestBody Expense expense, Authentication authentication) {
        try {
            logger.info("Creating expense for user: {}", authentication.getName());
            
            // Get the current user
            User currentUser = new User();
            currentUser.setId(getUserId(authentication));
            
            // Set the user in the expense
            expense.setUser(currentUser);
            
            // Validate the expense
            if (expense.getAmount() == null || expense.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body("Expense amount must be greater than 0");
            }
            
            if (expense.getDate() == null) {
                return ResponseEntity.badRequest().body("Date is required");
            }
            
            Expense savedExpense = expenseService.createExpense(expense);
            logger.info("Expense created successfully with ID: {}", savedExpense.getId());
            return ResponseEntity.ok(savedExpense);
        } catch (Exception e) {
            logger.error("Error creating expense: ", e);
            return ResponseEntity.badRequest().body("Failed to create expense: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserExpenses(Authentication authentication) {
        try {
            logger.info("Fetching expenses for user: {}", authentication.getName());
            return ResponseEntity.ok(expenseService.getUserExpenses(getUserId(authentication)));
        } catch (Exception e) {
            logger.error("Error fetching expenses: ", e);
            return ResponseEntity.badRequest().body("Failed to fetch expenses: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody Expense expense, Authentication authentication) {
        try {
            logger.info("Updating expense {} for user: {}", id, authentication.getName());
            return ResponseEntity.ok(expenseService.updateExpense(id, expense));
        } catch (Exception e) {
            logger.error("Error updating expense: ", e);
            return ResponseEntity.badRequest().body("Failed to update expense: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, Authentication authentication) {
        try {
            logger.info("Deleting expense {} for user: {}", id, authentication.getName());
            expenseService.deleteExpense(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting expense: ", e);
            return ResponseEntity.badRequest().body("Failed to delete expense: " + e.getMessage());
        }
    }

    @GetMapping("/filter")
    public List<Expense> filterExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        return expenseService.filterExpenses(category, startDate, endDate);
    }

    private Long getUserId(Authentication authentication) {
        // This should be implemented based on your user authentication setup
        // For now, we'll return a default user ID
        return 1L;
    }
}