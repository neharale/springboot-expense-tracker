package org.example.expensetracker.controller;

import org.example.expensetracker.model.Expense;
import org.example.expensetracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

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
        public Expense createExpense(@RequestBody Expense expense) {
                return expenseService.createExpense(expense);
        }

        @PutMapping("/{id}")
        public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
                return expenseService.updateExpense(id, expense);
        }

        @DeleteMapping("/{id}")
        public void deleteExpense(@PathVariable Long id) {
                expenseService.deleteExpense(id);
        }

        @GetMapping("/filter")
        public List<Expense> filterExpenses(
                @RequestParam(required = false) String category,
                @RequestParam(required = false) String startDate,
                @RequestParam(required = false) String endDate
        ) {
                return expenseService.filterExpenses(category, startDate, endDate);
        }
}