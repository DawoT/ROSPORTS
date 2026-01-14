erDiagram

    %% ======================================================================================
    %% 1. PRODUCT & CATALOG MANAGEMENT
    %% ======================================================================================
    
    products {
        bigint id PK
        string name
        string slug "UNIQUE"
        text description_short
        text description_long
        bigint brand_id FK
        bigint category_id FK
        decimal base_price
        decimal cost_price
        string tax_code
        string status
        jsonb attributes
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at "Soft Delete"
        bigint deleted_by FK
        text deletion_reason
    }

    product_variants {
        bigint id PK
        bigint product_id FK
        string sku "UNIQUE"
        string barcode "UNIQUE"
        string size
        string color
        decimal price_override
        decimal weight
        jsonb dimensions
        string main_image_url
        boolean is_active
        timestamp deleted_at "Soft Delete"
        bigint deleted_by FK
        text deletion_reason
    }

    brands {
        int id PK
        string name
        string logo_url
    }

    categories {
        int id PK
        int parent_id FK
        string name
        string slug
        string image_url
        boolean is_active
    }

    product_images {
        bigint id PK
        bigint product_id FK
        string url
        int display_order
        boolean is_primary
    }

    price_change_history {
        bigint id PK
        bigint variant_id FK
        decimal old_price
        decimal new_price
        string change_type "BASE, PROMO, BULK"
        string reference_source "promotion_id, bulk_import_id"
        string reference_id
        bigint changed_by FK
        text justification
        timestamp changed_at
    }

    %% Relationships
    products ||--|{ product_variants : "has"
    brands ||--o{ products : "manufactures"
    categories ||--o{ products : "classifies"
    categories ||--o{ categories : "parent of"
    products ||--|{ product_images : "showcased by"
    product_variants ||--o{ price_change_history : "audited by"

    %% ======================================================================================
    %% 2. INVENTORY MANAGEMENT (CONCURRENCY CRITICAL)
    %% ======================================================================================

    locations {
        int id PK
        string name
        string code "UNIQUE"
        string address
        string type
        boolean is_active
        boolean allows_sales
    }

    inventory_stock {
        bigint id PK
        bigint location_id FK
        bigint variant_id FK "UNIQUE COMPOSITE(variant, location)"
        int quantity_on_hand
        int quantity_reserved
        int quantity_available "GENERATED (on_hand - reserved)"
        timestamp last_counted_at
        bigint version "OPTIMISTIC LOCK"
        timestamp last_updated_at
        bigint last_updated_by FK
    }

    inventory_reservations {
        bigint id PK
        bigint variant_id FK
        bigint location_id FK
        string session_id
        int quantity
        timestamp expires_at "TTL Index needed"
        timestamp created_at
    }

    inventory_movements {
        bigint id PK
        bigint variant_id FK
        bigint from_location_id FK
        bigint to_location_id FK
        bigint user_id FK
        string movement_type
        int quantity
        string reference_doc
        text notes
        timestamp created_at "PARTITION KEY (Monthly)"
    }

    inventory_audit_snapshots {
        bigint id PK
        bigint variant_id FK
        bigint location_id FK
        int snapshot_quantity
        int discrepancy
        string snapshot_type
        bigint triggered_by FK
        timestamp snapshot_at
    }

    inventory_alerts {
        bigint id PK
        bigint variant_id FK
        bigint location_id FK
        int min_threshold
        boolean is_active
    }

    %% Relationships
    locations ||--o{ inventory_stock : "holds"
    product_variants ||--o{ inventory_stock : "stocked at"
    product_variants ||--o{ inventory_reservations : "reserved in"
    locations ||--o{ inventory_movements : "source/dest"
    product_variants ||--o{ inventory_movements : "moved"
    product_variants ||--o{ inventory_audit_snapshots : "snapshotted"

    %% ======================================================================================
    %% 3. CUSTOMERS & CRM
    %% ======================================================================================

    customers {
        bigint id PK
        string doc_type
        string doc_number "UNIQUE"
        string full_name
        string email "UNIQUE"
        string phone
        date birth_date
        string gender
        string segment
        boolean is_active
        timestamp created_at
        timestamp deleted_at "Soft Delete"
        bigint deleted_by FK
        text deletion_reason
    }

    customer_merge_log {
        bigint id PK
        bigint source_customer_id FK
        bigint target_customer_id FK
        bigint merged_by FK
        jsonb source_snapshot
        jsonb merge_strategy
        text merge_reason
        timestamp merged_at
    }

    customer_addresses {
        bigint id PK
        bigint customer_id FK
        string label
        string address_line
        string district
        string city
        string reference
        string geo_coordinates
        boolean is_default
    }

    loyalty_accounts {
        bigint id PK
        bigint customer_id FK
        int points_balance
        int lifetime_points
        timestamp last_movement_at
        bigint version "OPTIMISTIC LOCK"
    }

    loyalty_movements {
        bigint id PK
        bigint loyalty_account_id FK
        string type
        int points
        bigint order_id FK
        text reason
        timestamp created_at "PARTITION KEY (Yearly)"
    }

    customer_wallets {
        bigint id PK
        bigint customer_id FK
        decimal balance
        timestamp updated_at
        bigint version "OPTIMISTIC LOCK"
    }

    wallet_transactions {
        bigint id PK
        bigint wallet_id FK
        string type
        decimal amount
        string reference
        timestamp created_at
    }

    %% Relationships
    customers ||--o{ customer_addresses : "has"
    customers ||--|| loyalty_accounts : "owns"
    loyalty_accounts ||--o{ loyalty_movements : "logs"
    customers ||--|| customer_wallets : "holds"
    customer_wallets ||--o{ wallet_transactions : "audits"
    customers ||--o{ customer_merge_log : "merged_from"
    customers ||--o{ customer_merge_log : "merged_to"

    %% ======================================================================================
    %% 4. ORDERS & SALES (TRANSACTIONAL CORE)
    %% ======================================================================================

    orders {
        bigint id PK
        string order_number "UNIQUE"
        bigint customer_id FK
        bigint location_id FK
        bigint user_id FK
        string channel
        string status
        string payment_status
        string shipping_method
        decimal subtotal
        decimal discount_total
        decimal tax_total
        decimal shipping_cost
        decimal grand_total
        text notes
        timestamp created_at
        timestamp deleted_at "Soft Delete"
        bigint deleted_by FK
        text deletion_reason
        bigint version "OPTIMISTIC LOCK"
    }

    order_status_transitions {
        int id PK
        string from_status
        string to_status
        boolean requires_approval
        string required_permission
        int priority
    }

    order_status_history {
        bigint id PK
        bigint order_id FK
        string previous_status
        string new_status
        bigint changed_by FK
        text change_reason
        string ip_address
        timestamp changed_at
    }

    order_items {
        bigint id PK
        bigint order_id FK
        bigint variant_id FK
        int quantity
        decimal unit_price
        decimal total_price
        decimal discount_amount
        string status
    }

    payments {
        bigint id PK
        bigint order_id FK
        string idempotency_key "UNIQUE"
        string method
        decimal amount
        string transaction_id
        string status
        jsonb gateway_response
        timestamp idempotency_expires_at
        timestamp processed_at
        bigint version "OPTIMISTIC LOCK"
    }

    cash_sessions {
        bigint id PK
        bigint user_id FK
        bigint location_id FK
        timestamp opened_at
        timestamp closed_at
        decimal starting_cash
        decimal expected_cash
        decimal actual_cash
        decimal discrepancy
        string status
        bigint version "OPTIMISTIC LOCK"
    }

    cash_movements {
        bigint id PK
        bigint session_id FK
        string type
        decimal amount
        text reason
        timestamp created_at
    }

    %% Relationships
    customers ||--o{ orders : "places"
    locations ||--o{ orders : "fulfills"
    orders ||--|{ order_items : "contains"
    orders ||--o{ payments : "paid by"
    orders ||--o{ order_status_history : "tracks"
    product_variants ||--o{ order_items : "sku reference"
    cash_sessions ||--o{ cash_movements : "tracks"
    cash_sessions ||--o{ payments : "aggregates cash"

    %% ======================================================================================
    %% 5. ELECTRONIC INVOICING (SUNAT)
    %% ======================================================================================

    electronic_documents {
        bigint id PK
        bigint order_id FK
        bigint company_id FK
        string document_type
        string series "UNIQUE COMPOSITE(series, correlative)"
        int correlative_number
        date issue_date
        string currency
        decimal total_amount
        decimal total_igv
        decimal total_gravado
        string sunat_status
        text sunat_message
        string xml_url
        string pdf_url
        string cdr_url
        string hash_cpe
        timestamp created_at
        timestamp deleted_at "Soft Delete"
        bigint deleted_by FK
        text deletion_reason
    }

    document_sequences {
        int id PK
        bigint company_id FK
        string document_type
        string series
        int current_number
        bigint version "OPTIMISTIC LOCK"
        timestamp updated_at
    }

    companies {
        int id PK
        string ruc "UNIQUE"
        string raz_social
        string trade_name
        string address
        string certificate_path
        string sol_user
        string sol_pass
    }

    voided_documents {
        bigint id PK
        bigint document_id FK
        string reason
        string ticket_sunat
        string status
        timestamp voided_at
    }

    %% Relationships
    orders ||--o{ electronic_documents : "generates"
    companies ||--o{ electronic_documents : "issues"
    companies ||--o{ document_sequences : "manages"
    electronic_documents ||--o| voided_documents : "can be voided"

    %% ======================================================================================
    %% 6. SYSTEM CONFIG & REPORTING (BI)
    %% ======================================================================================

    system_settings {
        int id PK
        string setting_key "UNIQUE"
        string value
        string data_type
        text description
        boolean is_encrypted
        bigint last_updated_by FK
        timestamp updated_at
    }

    materialized_reports {
        bigint id PK
        string report_type "UNIQUE COMPOSITE(type, date, location)"
        date report_date
        bigint location_id FK
        jsonb aggregated_data
        timestamp generated_at
        timestamp expires_at
    }

    %% ======================================================================================
    %% 7. NOTIFICATIONS & MARKETING
    %% ======================================================================================

    promotions {
        bigint id PK
        string name
        string type
        decimal value
        timestamp start_date
        timestamp end_date
        boolean is_active
        int priority
        jsonb conditions
        timestamp deleted_at "Soft Delete"
        bigint deleted_by FK
        text deletion_reason
    }

    notifications {
        bigint id PK
        bigint customer_id FK
        bigint user_id FK
        string notification_type
        string channel
        string status
        jsonb payload
        string template_id
        int retry_count
        timestamp scheduled_for
        timestamp sent_at
        timestamp created_at
    }

    notification_templates {
        int id PK
        string template_id
        string channel
        string language
        text subject
        text body_template
        boolean is_active
    }

    coupons {
        bigint id PK
        string code "UNIQUE"
        bigint promotion_id FK
        int max_uses
        int used_count
        timestamp expires_at
    }

    order_promotions {
        bigint id PK
        bigint order_id FK
        bigint promotion_id FK
        bigint coupon_id FK
        decimal amount_discounted
    }

    %% Relationships
    promotions ||--o{ coupons : "generates"
    orders ||--o{ order_promotions : "benefits from"
    promotions ||--o{ order_promotions : "applied in"
    customers ||--o{ notifications : "receives"
    notification_templates ||--o{ notifications : "formats"

    %% ======================================================================================
    %% 8. SECURITY & LOGS
    %% ======================================================================================

    users {
        bigint id PK
        string email "UNIQUE"
        string password_hash
        string full_name
        string status
        timestamp last_login
        timestamp deleted_at "Soft Delete"
        bigint deleted_by FK
        text deletion_reason
    }

    roles {
        int id PK
        string name
        text description
    }

    permissions {
        int id PK
        string slug "UNIQUE"
        string description
    }

    role_permissions {
        int role_id FK
        int permission_id FK
    }

    user_roles {
        bigint user_id FK
        int role_id FK
    }

    audit_logs {
        bigint id PK
        bigint user_id FK
        string action
        string entity_table
        string entity_id
        jsonb old_values
        jsonb new_values
        string ip_address
        timestamp created_at "PARTITION KEY (Monthly)"
    }

    %% Relationships
    users ||--o{ user_roles : "assigned"
    roles ||--o{ user_roles : "defines"
    roles ||--o{ role_permissions : "has"
    permissions ||--o{ role_permissions : "granted to"
    users ||--o{ audit_logs : "performed"
