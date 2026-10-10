# \# data-least-privilege-lab

# 

# Experimental lab for exploring data least privilege between systems.

# 

# \## Current Architecture

# 

# ```text

# Client

# &#x20; |

# &#x20; | POST / JSON

# &#x20; v

# Gateway :3000

# &#x20; |

# &#x20; | forwards the full request body

# &#x20; v

# OMS Mock :3001

# ```

# 

# \## Current Problem

# 

# The gateway currently forwards all fields unchanged.

# 

# Example:

# 

# ```json

# {

# &#x20; "name": "Taro",

# &#x20; "address": "Fukuoka",

# &#x20; "sku": "ABC-123",

# &#x20; "quantity": 2

# }

# ```

# 

# Even if the downstream OMS only needs `sku` and `quantity`,

# personal data such as `name` and `address` is still forwarded.

# 

# This intentionally insecure flow is the baseline for the lab.he lab.

