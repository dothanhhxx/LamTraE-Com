import 'package:flutter/material.dart';

class ProductCard extends StatelessWidget {
  final void Function() addToCart;
  const ProductCard({super.key, required this.addToCart});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(onPressed: addToCart, child: const Text('Thêm vào giỏ'));
  }
}
