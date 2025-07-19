import type { User } from "@/stores/auth-store";
import { useAuthStore } from "@/stores/auth-store"; // Declare the useAuthStore variable

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

interface UserResponse {
  user: User;
}

export const authService = {
  // Simulate login API call
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate different responses based on email
      const { email, password } = credentials;

      // Simple validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (password.length < 3) {
        throw new Error("Invalid credentials");
      }

      // Simulate user data based on email
      let userData: User;

      if (email.includes("super")) {
        userData = {
          id: "1",
          name: "Super Admin User",
          email: email,
          role: "super-admin",
          department: "Administration",
        };
      } else if (email.includes("bureau")) {
        userData = {
          id: "2",
          name: "Bureau Head User",
          email: email,
          role: "bureau-head",
          department: "Management",
        };
      } else if (email.includes("adoption")) {
        userData = {
          id: "3",
          name: "Adoption Officer",
          email: email,
          role: "adoption",
          department: "Child Services",
        };
      } else if (email.includes("social")) {
        userData = {
          id: "4",
          name: "Social Affairs Officer",
          email: email,
          role: "social-affairs",
          department: "Social Services",
        };
      } else if (email.includes("women")) {
        userData = {
          id: "5",
          name: "Women Services Officer",
          email: email,
          role: "womens",
          department: "Women Affairs",
        };
      } else {
        userData = {
          id: "6",
          name: "Default User",
          email: email,
          role: "super-admin",
          department: "Administration",
        };
      }

      const mockToken = `mock-jwt-token-${userData.id}-${Date.now()}`;

      return {
        user: userData,
        token: mockToken,
        message: "Login successful",
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  },

  // Simulate get current user API call
  getCurrentUser: async (): Promise<UserResponse> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, this would validate the token and return user data
      // For simulation, we'll return the stored user data
      const { user } = useAuthStore.getState();

      if (!user) {
        throw new Error("User not found");
      }

      return { user };
    } catch (error) {
      throw new Error("Failed to get user data");
    }
  },

  // Simulate logout API call
  logout: async (): Promise<void> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // In real app, you might invalidate the token on the server
      return Promise.resolve();
    } catch (error) {
      // Even if logout fails on server, we should still logout locally
      return Promise.resolve();
    }
  },
};
